#!/usr/bin/bash

set -x
set -euo pipefail

# Interpreted environment variables.
#
#   PATH_DB_BASE    -- base directory for database defaults
#                      default: /data/annonars
#   HTTP_HOST       -- host to listen on
#                      default: 0.0.0.0
#   HTTP_PORT       -- port
#                      default: 8080
#
#   PATH_DB_CADD_37           -- path to CADD database for GRCh37, defaults to $PATH_DB_BASE/grch37/cadd/rocksdb
#   PATH_DB_CADD_38           -- path to CADD database for GRCh38, defaults to $PATH_DB_BASE/grch38/cadd/rocksdb
#   PATH_DB_DBSNP_37          -- path to dbSNP database for GRCh37, defaults to $PATH_DB_BASE/grch37/dbsnp/rocksdb
#   PATH_DB_DBSNP_38          -- path to dbSNP database for GRCh38, defaults to $PATH_DB_BASE/grch38/dbsnp/rocksdb
#   PATH_DB_DBNSFP_37         -- path to dbNSFP database for GRCh37, defaults to $PATH_DB_BASE/grch37/dbnsfp/rocksdb
#   PATH_DB_DBNSFP_38         -- path to dbNSFP database for GRCh38, defaults to $PATH_DB_BASE/grch38/dbnsfp/rocksdb
#   PATH_DB_DBSCSNV_37        -- path to dbscSNV database for GRCh37, defaults to $PATH_DB_BASE/grch37/dbscsnv/rocksdb
#   PATH_DB_DBSCSNV_38        -- path to dbscSNV database for GRCh38, defaults to $PATH_DB_BASE/grch38/dbscsnv/rocksdb
#   PATH_DB_GNOMAD_MTDNA_37   -- path to gnomAD mtDNA database for GRCh37, defaults to $PATH_DB_BASE/grch37/gnomad-mtdna/rocksdb
#   PATH_DB_GNOMAD_MTDNA_38   -- path to gnomAD mtDNA database for GRCh38, defaults to $PATH_DB_BASE/grch38/gnomad-mtdna/rocksdb
#   PATH_DB_GNOMAD_EXOMES_37  -- path to gnomAD exomes database for GRCh37, defaults to $PATH_DB_BASE/grch37/gnomad-exomes/rocksdb
#   PATH_DB_GNOMAD_EXOMES_38  -- path to gnomAD exomes database for GRCh38, defaults to $PATH_DB_BASE/grch38/gnomad-exomes/rocksdb
#   PATH_DB_GNOMAD_GENOMES_37 -- path to gnomAD genomes database for GRCh37, defaults to $PATH_DB_BASE/grch37/gnomad-genomes/rocksdb
#   PATH_DB_GNOMAD_GENOMES_38 -- path to gnomAD genomes database for GRCh38, defaults to $PATH_DB_BASE/grch38/gnomad-genomes/rocksdb
#   PATH_DB_HELIXMTDB_37      -- path to HelixMTdb database for GRCh37, defaults to $PATH_DB_BASE/grch37/helixmtdb/rocksdb
#   PATH_DB_HELIXMTDB_38      -- path to HelixMTdb database for GRCh38, defaults to $PATH_DB_BASE/grch38/helixmtdb/rocksdb
#   PATH_DB_CONS_37           -- path to UCSC conservation database for GRCh37, defaults to $PATH_DB_BASE/grch37/cons/rocksdb
#   PATH_DB_CONS_38           -- path to UCSC conservation database for GRCh38, defaults to $PATH_DB_BASE/grch38/cons/rocksdb
#
#   PATH_GENES                -- path to the genes RocksDB, defaults to $PATH_DB_BASE/genes/rocksdb

PATH_DB_BASE=${PATH_HPO_DIR-/data/annonars}
HTTP_HOST=${HTTP_HOST-0.0.0.0}
HTTP_PORT=${HTTP_PORT-8080}

PATH_DB_CADD_37=${PATH_DB_CADD_37-$PATH_DB_BASE/grch37/cadd/rocksdb}
PATH_DB_CADD_38=${PATH_DB_CADD_38-$PATH_DB_BASE/grch38/cadd/rocksdb}
PATH_DB_DBSNP_37=${PATH_DB_DBSNP_37-$PATH_DB_BASE/grch37/dbsnp/rocksdb}
PATH_DB_DBSNP_38=${PATH_DB_DBSNP_38-$PATH_DB_BASE/grch38/dbsnp/rocksdb}
PATH_DB_DBNSFP_37=${PATH_DB_DBNSFP_37-$PATH_DB_BASE/grch37/dbnsfp/rocksdb}
PATH_DB_DBNSFP_38=${PATH_DB_DBNSFP_38-$PATH_DB_BASE/grch38/dbnsfp/rocksdb}
PATH_DB_DBSCSNV_37=${PATH_DB_DBSCSNV_37-$PATH_DB_BASE/grch37/dbscsnv/rocksdb}
PATH_DB_DBSCSNV_38=${PATH_DB_DBSCSNV_38-$PATH_DB_BASE/grch38/dbscsnv/rocksdb}
PATH_DB_GNOMAD_MTDNA_37=${PATH_DB_GNOMAD_MTDNA_37-$PATH_DB_BASE/grch37/gnomad-mtdna/rocksdb}
PATH_DB_GNOMAD_MTDNA_38=${PATH_DB_GNOMAD_MTDNA_38-$PATH_DB_BASE/grch38/gnomad-mtdna/rocksdb}
PATH_DB_GNOMAD_EXOMES_37=${PATH_DB_GNOMAD_EXOMES_37-$PATH_DB_BASE/grch37/gnomad-exomes/rocksdb}
PATH_DB_GNOMAD_EXOMES_38=${PATH_DB_GNOMAD_EXOMES_38-$PATH_DB_BASE/grch38/gnomad-exomes/rocksdb}
PATH_DB_GNOMAD_GENOMES_37=${PATH_DB_GNOMAD_GENOMES_37-$PATH_DB_BASE/grch37/gnomad-genomes/rocksdb}
PATH_DB_GNOMAD_GENOMES_38=${PATH_DB_GNOMAD_GENOMES_38-$PATH_DB_BASE/grch38/gnomad-genomes/rocksdb}
PATH_DB_HELIXMTDB_37=${PATH_DB_HELIXMTDB_37-$PATH_DB_BASE/grch37/helixmtdb/rocksdb}
PATH_DB_HELIXMTDB_38=${PATH_DB_HELIXMTDB_38-$PATH_DB_BASE/grch38/helixmtdb/rocksdb}
PATH_DB_CONS_37=${PATH_DB_CONS_37-$PATH_DB_BASE/grch37/cons/rocksdb}
PATH_DB_CONS_38=${PATH_DB_CONS_38-$PATH_DB_BASE/grch38/cons/rocksdb}
PATH_GENES=${PATH_GENES-$PATH_DB_BASE/genes/rocksdb}

first=${1-}

if [ "$first" == exec ]; then
  shift
  exec "$@"
else
  exec \
    annonars \
    run-server \
      $(test -e $PATH_DB_CADD_37 && echo --path-cadd $PATH_DB_CADD_37) \
      $(test -e $PATH_DB_CADD_38 && echo --path-cadd $PATH_DB_CADD_38) \
      $(test -e $PATH_DB_DBSNP_37 && echo --path-dbsnp $PATH_DB_DBSNP_37) \
      $(test -e $PATH_DB_DBSNP_38 && echo --path-dbsnp $PATH_DB_DBSNP_38) \
      $(test -e $PATH_DB_DBNSFP_37 && echo --path-dbnsfp $PATH_DB_DBNSFP_37) \
      $(test -e $PATH_DB_DBNSFP_38 && echo --path-dbnsfp $PATH_DB_DBNSFP_38) \
      $(test -e $PATH_DB_DBSCSNV_37 && echo --path-dbscsnv $PATH_DB_DBSCSNV_37) \
      $(test -e $PATH_DB_DBSCSNV_38 && echo --path-dbscsnv $PATH_DB_DBSCSNV_38) \
      $(test -e $PATH_DB_GNOMAD_MTDNA_37 && echo --path-gnomad-mtdna $PATH_DB_GNOMAD_MTDNA_37) \
      $(test -e $PATH_DB_GNOMAD_MTDNA_38 && echo --path-gnomad-mtdna $PATH_DB_GNOMAD_MTDNA_38) \
      $(test -e $PATH_DB_GNOMAD_EXOMES_37 && echo --path-gnomad-exomes $PATH_DB_GNOMAD_EXOMES_37) \
      $(test -e $PATH_DB_GNOMAD_EXOMES_38 && echo --path-gnomad-exomes $PATH_DB_GNOMAD_EXOMES_38) \
      $(test -e $PATH_DB_GNOMAD_GENOMES_37 && echo --path-gnomad-genomes $PATH_DB_GNOMAD_GENOMES_37) \
      $(test -e $PATH_DB_GNOMAD_GENOMES_38 && echo --path-gnomad-genomes $PATH_DB_GNOMAD_GENOMES_38) \
      $(test -e $PATH_DB_HELIXMTDB_37 && echo --path-helixmtdb $PATH_DB_HELIXMTDB_37) \
      $(test -e $PATH_DB_HELIXMTDB_38 && echo --path-helixmtdb $PATH_DB_HELIXMTDB_38) \
      $(test -e $PATH_DB_CONS_37 && echo --path-ucsc-conservation $PATH_DB_CONS_37) \
      $(test -e $PATH_DB_CONS_38 && echo --path-ucsc-conservation $PATH_DB_CONS_38) \
      $(test -e $PATH_GENES && echo --path-ucsc-conservation $PATH_GENES) \
      \
      --listen-host "$HTTP_HOST" \
      --listen-port "$HTTP_PORT"
fi

exit $?
